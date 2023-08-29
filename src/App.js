import './App.css';
import React from 'react'

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
        //const url = 'http://192.168.9.61:8000/inventory/api/plasmids'
        const url = '/inventory/api/plasmids'
        axios.get(url)
            .then((response) => {
                let output = []
                if (response.data.plasmids) {
                    response.data.plasmids.forEach((plasmid, index) => {
                        const csrf_token = response.data.csrf_token
                        const table_filters = response.data.table_filters
                        let plasmid_level = ""
                        if (plasmid.l !== null) plasmid_level = " filter-l" + plasmid.l
                        let plasmid_type = ""
                        if (plasmid.t !== null) plasmid_type = " filter-t" + plasmid.t

                        let plasmid_computed_size = 'No edit perms'
                        let plasmid_create_build = 'No edit perms'

                        if (plasmid.p) {
                            let reOpts = []
                            response.data.RESTRICTION_ENZYMES.forEach((re) => {
                                let btnClass = "btn-outline-primary"
                                if(plasmid.r === re.name){
                                    btnClass = "btn-primary"
                                }
                                reOpts.push(
                                    <button
                                        className={"btn " + btnClass + " btn-sm me-1"}
                                        role="button" name="enzyme" value={re.name}>
                                        {re.name}
                                    </button>
                                )
                            })
                            plasmid_create_build = <div>
                            <form method="post" className="default-style inline"
                                  action={"/inventory/plasmid/view_edit/" + plasmid.i}>
                                <input type="hidden" name="csrfmiddlewaretoken" value={csrf_token}/>
                                <button className="btn text-success me-1" name="create" data-bs-toggle="tooltip" data-bs-placement="top" title="Create blank"><i
                                    className="bi bi-file-earmark-plus"></i></button>
                            </form>
                            <div class="dropdown dropdown-enzymes" data-bs-toggle="tooltip" data-bs-placement="top" title="Build">
                                <button type="button" class="btn text-primary dropdown-toggle" id="dropdownEnzymes" data-bs-toggle="dropdown" aria-expanded="false"><i
                                        class="bi bi-hammer"></i></button>
                                <div className="dropdown-menu p-2 fw-light " aria-labelledby="dropdownEnzymes">
                                    <div className="dropdown-menu-header">Chooose enzyme</div>
                                    <hr className="m-1"/>
                                    <form method="post" className="default-style">
                                        <input type="hidden" name="csrfmiddlewaretoken" value={csrf_token}/>
                                        <input type="hidden" name="create_from_parts"/>
                                        <div className="dropdown-menu-body pt-1">
                                            {reOpts}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div> }

                        let plasmid_insert_computed_size = ""

                        let plasmid_edits = []
                        if (plasmid.p) {
                            plasmid_edits.push(<a href={"/inventory/plasmid/validation/edit/" + plasmid.i}
                                   className="btn text-primary me-1"
                                   role="button" target="_blank" rel="noreferrer" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit validation"><i
                                    className="bi bi-check2-square"></i></a>)
                        }
                        let plasmid_sequence_options = []

                        if (plasmid.hs) {
                            plasmid_sequence_options.push(
                                <div className="dropdown dropdown-download" data-bs-toggle="tooltip"
                                     data-bs-placement="top" title="Download">
                                    <button type="button" className="btn text-primary dropdown-toggle me-1"
                                            id="dropdownDownload" data-bs-toggle="dropdown" aria-expanded="false"><i
                                        className="bi bi-download"></i>
                                    </button>
                                    <div className="dropdown-menu p-2 fw-light " aria-labelledby="dropdownDownload">
                                        <div className="dropdown-menu-header">Chooose format</div>
                                        <hr className="m-1"/>
                                        <div className="dropdown-menu-body pt-1">
                                            <a href={"/inventory/plasmid/download/" + plasmid.i}
                                               className="btn btn-outline-primary btn-sm me-1"
                                               role="button"
                                               download={plasmid.n}>ORIG</a>
                                            <a href={"/inventory/plasmid/download/" + plasmid.i + "?format=gb"}
                                               className="btn btn-outline-primary btn-sm me-1"
                                               role="button"
                                               download={plasmid.n}>GB</a>
                                            <a href={"/inventory/plasmid/download/" + plasmid.i + "?format=fasta"}
                                               className="btn btn-outline-primary btn-sm" role="button"
                                               download={plasmid.n}>FASTA</a>
                                        </div>
                                    </div>
                                </div>
                            )
                            plasmid_sequence_options.push(<a href={"/inventory/plasmid/digest/" + plasmid.i}
                                   className="btn text-secondary me-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Digest"
                                   role="button" target="_blank" rel="noreferrer"><i className="bi bi-scissors"></i></a>)
                            plasmid_sequence_options.push(<a href={"/inventory/plasmid/view_edit/" + plasmid.i} className="btn text-info me-1"
                                   role="button" target="_blank" rel="noreferrer" data-bs-toggle="tooltip" data-bs-placement="top" title="View / edit sequence"><i className="bi bi-eye"></i> / <i
                                    className="bi bi-pencil"></i></a>)
                            plasmid_sequence_options.push(<a href={"/inventory/plasmid/pcr/" + plasmid.i} className="btn text-success me-1"
                                   role="button" target="_blank" rel="noreferrer" data-bs-toggle="tooltip" data-bs-placement="top" title="Design PCR"><i
                                    className="bi bi-arrow-return-right"></i></a>)

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
                                plasmid_size_output.push(<span> / {plasmid_insert_computed_size}</span>)
                            }
                            plasmid_computed_size = <span>{plasmid_size_output}</span>
                            plasmid_create_build = null
                        }
                        else {
                            plasmid_computed_size = <span>No sequence<br/>{plasmid_create_build}</span>
                        }
                        let plasmid_glycerol_stocks = []
                        if (plasmid.g.length) {
                            for (let gid in plasmid.g) {
                                const gs = plasmid.g[gid]
                                plasmid_glycerol_stocks.push(
                                    <div><a href={"/inventory/glycerolstock/" + gs.i} className="btn btn-outline-secondary"
                                            role="button" target="_blank" rel="noreferrer">
                                        <strong>{gs.s}</strong> <span
                                        className="text-muted small ps-2">{gs.br + gs.bc + " / " + gs.b}</span>
                                    </a></div>
                                )
                            }
                        } else {
                            plasmid_glycerol_stocks.push("No glycerolstocks. ")
                            plasmid_glycerol_stocks.push(<a href={"/inventory/glycerolstock/create/" + plasmid.i}
                                                            className="btn btn-outline-secondary" role="button"
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
                        let plasmid_icon = ""
                        if (plasmid.cs === 'v') {
                            // verified
                            plasmid_icon = <i className="bi bi-check-circle-fill ms-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Validated"></i>
                        } else if(plasmid.cs === 'r') {
                            // reference
                            plasmid_icon = <i className="bi bi-bookmarks ms-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Reference"></i>
                        } else if(plasmid.cs === 'c') {
                            // under construction
                            plasmid_icon = <i className="bi bi-hammer ms-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Under construction"></i>
                        }
                        let plasmid_type_output = []
                        let plasmid_level_output = []
                        if (plasmid.l !== undefined) {
                            plasmid_level_output.push(plasmid.l)
                        }
                        if (plasmid.t !== undefined) {
                            let type_name = "Insert"
                            if (plasmid.t === 1) {
                                type_name = "Receiver"
                            }
                            plasmid_type_output.push(type_name)
                        }
                        let plasmid_name = plasmid.n
                        if(plasmid.n.length > 25)
                            plasmid_name = plasmid.n.substring(0, 26) + "..."
                        plasmid_name = <span><span class="plasmid_list-name">{plasmid_name}</span><span class="plasmid_list-id badge text-bg-light text-success ms-1">{plasmid.ix}</span></span>
                        let plasmid_edit = ""
                        if(plasmid.p)
                            plasmid_edit = <a href={"/inventory/plasmid/edit/" + plasmid.i} className="btn text-secondary me-1"
                                   role="button" target="_blank" rel="noreferrer" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><i className="bi bi-pencil-fill"></i></a>
                        output.push(<tr className={"filter-item" + plasmid_level + plasmid_type + table_filters_output}>
                            <td>
                                <a href={"/inventory/plasmid/" + plasmid.i}
                                   className="btn btn-success table-search-search_on me-1"
                                   data-name={plasmid.n}
                                   data-search={plasmid.n+plasmid.ix}
                                   role="button" target="_blank" rel="noreferrer">{plasmid_name}{plasmid_icon}</a>
                                   {plasmid_edit}
                           </td>
                           <td>
                                <button className="btn text-secondary me-1 copy_clipboard-child" data-bs-toggle="tooltip" data-bs-placement="top" title="Copy name"><i className="bi bi-clipboard copy_clipboard" data-cc={plasmid.cn}></i></button>
                                <a href={"/inventory/plasmid/label/" + plasmid.i} className="btn text-info me-1"
                                       role="button" target="_blank" rel="noreferrer" data-bs-toggle="tooltip" data-bs-placement="top" title="Print label"><i className="bi bi-tag-fill"></i></a>
                                {plasmid_edits}
                            </td>
                            <td>{plasmid_create_build}{plasmid_sequence_options}</td>
                            <td>
                                <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target={"#modal-" + index}>
                                  Details
                                </button>
                                <div class="modal" id={"modal-" + index} tabindex="-1" aria-labelledby={"modal_title-" + index} aria-hidden="true">
                                  <div class="modal-dialog">
                                    <div class="modal-content">
                                      <div class="modal-header">
                                        <h1 class="modal-title fs-5" id={"modal_title-" + index}>{plasmid.n}</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                      </div>
                                      <div class="modal-body">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Property</th>
                                                    <th scope="col">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Level</td>
                                                    <td>{plasmid_level_output}</td>
                                                </tr>
                                                <tr>
                                                    <td>Type</td>
                                                    <td>{plasmid_type_output}</td>
                                                </tr>
                                                <tr>
                                                    <td>Marker</td>
                                                    <td>{plasmid.sm}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total / insert length</td>
                                                    <td>{plasmid_computed_size}</td>
                                                </tr>
                                                <tr>
                                                    <td>Colony</td>
                                                    <td>{plasmid.wc}</td>
                                                </tr>
                                                <tr>
                                                    <td>Ligation concentration</td>
                                                    <td>{plasmid.lc}</td>
                                                </tr>
                                                <tr>
                                                    <td>Stocks</td>
                                                    <td>{plasmid_glycerol_stocks}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </td>
                        </tr>)
                    })
                    output = <table id="plasmids-table"
                                    className="table table-striped table-hover sortable table-search-target">
                        <thead>
                        <tr>
                            <th scope="col">Plasmid</th>
                            <th scope="col">Actions</th>
                            <th scope="col" data-defaultsort='disabled'>Sequence</th>
                            <th scope="col" data-defaultsort='disabled'>Details</th>
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

    componentDidUpdate() {
        window.onReady()
        window.do_filter_default()
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        let render = <div className="alert alert-info">
            <div className="spinner-grow spinner-grow-sm" role="status">
                <span className="visually-hidden">...</span>
            </div> Loading plasmids
        </div>
        if (!this.state.loading) {
            render = this.state.plasmids_render
        }
        return (<div>{render}</div>)
    }
}

export default App;
