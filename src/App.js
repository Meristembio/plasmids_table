import './App.css';
import React from 'react'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            plasmids_render: '',
            loading: true
        }
    }

    loadData() {
        const axios = require('axios');
        // const url = 'http://192.168.1.64:8000/inventory/api/plasmids'
        const url = '/inventory/api/plasmids'
        axios.get(url)
            .then((response) => {
                let output = []
                if (response.data.plasmids) {
                    response.data.plasmids.forEach((plasmid) => {
                        const has_perm_to_edit = response.data.has_perm_to_edit
                        const csrf_token = response.data.csrf_token
                        const table_filters = response.data.table_filters
                        let plasmid_level = ""
                        if (plasmid.l !== null) plasmid_level = " filter-l" + plasmid.l
                        let plasmid_type = ""
                        if (plasmid.t !== null) plasmid_type = " filter-t" + plasmid.t

                        let plasmid_computed_size = <div>
                            <form method="post" class="default-style inline"
                                  action={"/inventory/plasmid/view_edit/" + plasmid.i}>
                                <input type="hidden" name="csrfmiddlewaretoken" value={csrf_token}/>
                                <button class="btn btn-outline-success me-1" name="create"><i
                                    class="bi bi-file-earmark-plus"></i></button>
                            </form>
                            <button class="btn btn-outline-primary enzyme-options me-1"
                                    data-link={"/inventory/plasmid/" + plasmid.i} data-refc={plasmid.r}><i
                                class="bi bi-hammer"></i></button>
                        </div>

                        let plasmid_insert_computed_size = ""

                        let plasmid_edits = []
                        if (has_perm_to_edit) {
                            plasmid_edits.push(<OverlayTrigger placement="right"
                                                               overlay={<Tooltip>Edit validation</Tooltip>}>
                                <a href={"/inventory/plasmid_validation/edit/" + plasmid.i}
                                   class="btn btn-outline-primary me-1"
                                   role="button" target="_blank" rel="noreferrer"><i
                                    class="bi bi-check2-square"></i></a>
                            </OverlayTrigger>)
                            plasmid_edits.push(<OverlayTrigger placement="right"
                                                               overlay={<Tooltip>Edit plasmid data</Tooltip>}>
                                <a href={"/inventory/plasmid/edit/" + plasmid.i} class="btn btn-outline-secondary me-1"
                                   role="button" target="_blank" rel="noreferrer"><i class="bi bi-pencil-fill"></i></a>
                            </OverlayTrigger>)
                        }
                        let plasmid_sequence_options = []

                        if (plasmid.hs) {
                            plasmid_sequence_options.push(<div class="download-links">
                                <a href={"/inventory/plasmid/download/" + plasmid.i}
                                   class="btn btn-outline-primary me-1"
                                   role="button"
                                   download={plasmid.n}><i class="bi bi-download"></i> ORIG</a>
                                <a href={"/inventory/plasmid/download/" + plasmid.i + "?format=gb"}
                                   class="btn btn-outline-primary me-1"
                                   role="button"
                                   download={plasmid.n}><i class="bi bi-download"></i> .GB</a>
                                <a href={"/inventory/plasmid/download/" + plasmid.i + "?format=fasta"}
                                   class="btn btn-outline-primary me-1" role="button"
                                   download={plasmid.n}><i class="bi bi-download"></i> .FASTA</a>
                            </div>)
                            plasmid_sequence_options.push(<OverlayTrigger placement="right"
                                                                          overlay={<Tooltip>Download</Tooltip>}>
                                <button type="button"
                                        className="btn btn-outline-primary download-options me-1 button_label_autohide">
                                    <i
                                        className="bi bi-download"></i></button>
                            </OverlayTrigger>)
                            plasmid_sequence_options.push(<OverlayTrigger placement="right"
                                                                          overlay={<Tooltip>Digest</Tooltip>}>
                                <a href={"/inventory/plasmid/digest/" + plasmid.i}
                                   class="btn btn-outline-secondary me-1"
                                   role="button" target="_blank" rel="noreferrer"><i class="bi bi-scissors"></i></a>
                            </OverlayTrigger>)
                            plasmid_sequence_options.push(<OverlayTrigger placement="right"
                                                                          overlay={<Tooltip>View / edit
                                                                              sequence</Tooltip>}>
                                <a href={"/inventory/plasmid/view_edit/" + plasmid.i} class="btn btn-outline-info me-1"
                                   role="button" target="_blank" rel="noreferrer"><i class="bi bi-eye"></i> / <i
                                    class="bi bi-pencil"></i></a>
                            </OverlayTrigger>)
                            plasmid_sequence_options.push(<OverlayTrigger placement="right"
                                                                          overlay={<Tooltip>Design PCR</Tooltip>}>
                                <a href={"/inventory/plasmid/pcr/" + plasmid.i} class="btn btn-outline-success me-1"
                                   role="button" target="_blank" rel="noreferrer"><i
                                    class="bi bi-arrow-return-right"></i></a>
                            </OverlayTrigger>)

                            if (plasmid.c !== null && plasmid.c > 0) {
                                if (plasmid.c < 1000) {
                                    plasmid_computed_size = plasmid.c + " b"
                                } else {
                                    plasmid_computed_size = Math.floor(plasmid.c / 1000 * 10) / 10 + " k"
                                }

                            }
                            let plasmid_size_output = [plasmid_computed_size]
                            if (plasmid.ic !== null && plasmid.ic > 0) {
                                if (plasmid.ic < 1000) {
                                    plasmid_insert_computed_size = plasmid.ic + " b"
                                } else {
                                    plasmid_insert_computed_size = Math.floor(plasmid.ic / 1000 * 10) / 10 + " k"
                                }
                                plasmid_size_output.push(<span class="text-secondary"> - {plasmid_insert_computed_size}</span>)
                            }
                            if (plasmid.c !== null) plasmid_computed_size = <span>{plasmid_size_output}</span>
                        }
                        let plasmid_glycerol_stocks = []
                        if (plasmid.g.length) {
                            for (let gid in plasmid.g) {
                                const gs = plasmid.g[gid]
                                plasmid_glycerol_stocks.push(
                                    <div><a href={"/inventory/glycerolstock/" + gs.i} class="btn btn-outline-secondary"
                                            role="button" target="_blank" rel="noreferrer">
                                        <strong>{gs.s}</strong> <span
                                        className="text-muted small ps-2">{gs.br + gs.bc + " / " + gs.b}</span>
                                    </a></div>
                                )
                            }
                        } else {
                            plasmid_glycerol_stocks.push("No glycerolstocks. ")
                            plasmid_glycerol_stocks.push(<a href={"/inventory/glycerolstock/create/" + plasmid.i}
                                                            class="btn btn-outline-secondary" role="button"
                                                            target="_blank" rel="noreferrer">+ Create</a>)
                        }
                        let table_filters_output = ""
                        table_filters.forEach((table_filter) => {
                            if (table_filter[0] === 'startswith') {
                                table_filter[2].forEach((table_filter_op) => {
                                    if (plasmid.n.toLowerCase().startsWith(table_filter_op[1])) {
                                        table_filters_output += " filter-" + table_filter_op[1]
                                    }
                                })
                            }
                        })
                        let plasmid_ok = ""
                        // check_state = 'Not required' or 'Correct'
                        // sequencing_state = 'Not required' or 'Correct'
                        if ((plasmid.cs === 0 || plasmid.cs === 2) && (plasmid.ss === 0 || plasmid.ss === 2)) {
                            plasmid_ok = <OverlayTrigger placement="right"
                                                         overlay={<Tooltip>Validated plasmid</Tooltip>}>
                                <i class="bi bi-check-circle-fill"></i>
                            </OverlayTrigger>
                        }
                        let plasmid_type_level = []
                        if (plasmid.l !== undefined) {
                            plasmid_type_level.push(<span>L{plasmid.l}</span>)
                        }
                        if (plasmid.t !== undefined) {
                            let type_name = "Insert"
                            if (plasmid.t === 1) {
                                type_name = "Receiver"
                            }
                            plasmid_type_level.push(<span className="text-secondary"> - {type_name}</span>)
                        }
                        output.push(<tr class={"filter-item" + plasmid_level + plasmid_type + table_filters_output}>
                            <td>
                                <a href={"/inventory/plasmid/" + plasmid.i}
                                   class="btn btn-success table-search-search_on me-1"
                                   role="button" target="_blank" rel="noreferrer">{plasmid.n} {plasmid_ok}</a>
                                <OverlayTrigger placement="right"
                                                overlay={<Tooltip>Copy name</Tooltip>}>
                                    <button class="btn btn-outline-secondary me-1"><i class="bi bi-clipboard copy_clipboard" data-cc={plasmid.n}></i></button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="right"
                                                overlay={<Tooltip>Print label</Tooltip>}>
                                    <a href={"/inventory/plasmid/label/" + plasmid.i} class="btn btn-outline-info me-1"
                                       role="button" target="_blank" rel="noreferrer"><i class="bi bi-tag-fill"></i></a>
                                </OverlayTrigger>
                                {plasmid_edits}
                            </td>
                            <td>{plasmid_type_level} <span class="text-secondary"></span></td>
                            <td>{plasmid.rh}</td>
                            <td>
                                {plasmid_computed_size}
                            </td>
                            <td>
                                {plasmid_sequence_options}
                            </td>
                            <td>
                                {plasmid_glycerol_stocks}
                            </td>
                        </tr>)
                    })
                    output = <table id="plasmids-table"
                                    className="table table-striped table-hover sortable table-search-target">
                        <thead>
                        <tr>
                            <th scope="col">Plasmid</th>
                            <th scope="col">Level - Type</th>
                            <th scope="col">Resistance</th>
                            <th scope="col" data-defaultsort='disabled'>Total - Insert length</th>
                            <th scope="col" data-defaultsort='disabled'>Sequence</th>
                            <th scope="col">Glycerol Stock</th>
                        </tr>
                        </thead>
                        <tbody>{output}</tbody>
                    </table>
                } else {
                    output = <div className="alert alert-info">
                        <i className="bi bi-emoji-frown"></i> No plasmids
                    </div>
                }
                this.setState({
                    plasmids_render: output,
                    loading: false
                })
            })
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        let render = <div className="alert alert-info">
            <div className="spinner-grow spinner-grow-sm" role="status">
                <span className="visually-hidden">...</span>
            </div>
            Loading plasmids
        </div>
        if (!this.state.loading) {
            render = this.state.plasmids_render
        }
        return (<div>{render}</div>)
    }
}

export default App;
